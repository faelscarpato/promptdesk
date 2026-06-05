// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_processor;
mod llm_client;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Prompt {
    id: String,
    content: String,
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_prompt(prompt: Prompt) -> Result<(), String> {
    println!("Salvando prompt: {:?}", prompt);
    Ok(())
}

#[tauri::command]
fn list_prompts() -> Result<Vec<Prompt>, String> {
    Ok(vec![])
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_file,
            save_prompt,
            list_prompts,
            file_processor::process_file,
            llm_client::call_llm
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
