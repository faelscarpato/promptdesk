use std::fs;
use std::path::Path;
use regex::Regex;
use calamine::{Reader, Xlsx, open_workbook};

pub enum SupportedFileType {
    Pdf,
    Txt,
    Docx,
    Xlsx,
    Unsupported,
}

impl SupportedFileType {
    pub fn from_extension(extension: &str) -> Self {
        match extension.to_lowercase().as_str() {
            "pdf" => Self::Pdf,
            "txt" => Self::Txt,
            "docx" => Self::Docx,
            "xlsx" => Self::Xlsx,
            _ => Self::Unsupported,
        }
    }
}

fn clean_text(text: String) -> String {
    let re_spaces = Regex::new(r"\s+").unwrap();
    let cleaned = re_spaces.replace_all(&text, " ").to_string();
    cleaned.trim().to_string()
}

pub fn read_txt(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string()).map(clean_text)
}

pub fn read_pdf(path: &str) -> Result<String, String> {
    pdf_extract::extract_text(path).map_err(|e| e.to_string()).map(clean_text)
}

pub fn read_docx(path: &str) -> Result<String, String> {
    Ok(format!("Conteúdo extraído do DOCX em: {}", path))
}

pub fn read_xlsx(path: &str) -> Result<String, String> {
    let mut excel: Xlsx<_> = open_workbook(path).map_err(|e: calamine::XlsxError| e.to_string())?;
    let mut content = String::new();
    
    for sheet_name in excel.sheet_names().to_owned() {
        if let Some(Ok(range)) = excel.worksheet_range(&sheet_name) {
            content.push_str(&format!("Sheet: {}\n", sheet_name));
            for row in range.rows() {
                for cell in row {
                    content.push_str(&format!("{} ", cell));
                }
                content.push('\n');
            }
        }
    }
    Ok(clean_text(content))
}

#[tauri::command]
pub async fn process_file(path: String) -> Result<String, String> {
    let extension = Path::new(&path)
        .extension()
        .and_then(|ext| ext.to_str())
        .ok_or("Arquivo sem extensão")?;

    let file_type = SupportedFileType::from_extension(extension);

    match file_type {
        SupportedFileType::Txt => read_txt(&path),
        SupportedFileType::Pdf => read_pdf(&path),
        SupportedFileType::Docx => read_docx(&path),
        SupportedFileType::Xlsx => read_xlsx(&path),
        SupportedFileType::Unsupported => Err("Formato de arquivo não suportado".to_string()),
    }
}
