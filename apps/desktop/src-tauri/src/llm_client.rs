use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct LLMResponse {
    pub content: String,
    pub tokens_used: u32,
}

#[derive(Serialize)]
struct GenericChatRequest {
    model: String,
    messages: Vec<Message>,
    #[serde(skip_serializing_if = "Option::is_none")]
    temperature: Option<f32>,
}

#[derive(Serialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Deserialize)]
struct GenericChatResponse {
    choices: Vec<Choice>,
    usage: Option<Usage>,
}

#[derive(Deserialize)]
struct Choice {
    message: ResponseMessage,
}

#[derive(Deserialize)]
struct ResponseMessage {
    content: String,
}

#[derive(Deserialize)]
struct Usage {
    total_tokens: u32,
}

#[tauri::command]
pub async fn call_llm(
    base_url: String,
    api_key: String,
    model: String,
    prompt: String,
    temperature: Option<f32>,
) -> Result<LLMResponse, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(120))
        .build()
        .map_err(|e| e.to_string())?;

    // Normaliza a URL para garantir que termine com /v1/chat/completions se necessário
    let url = if base_url.ends_with("/chat/completions") {
        base_url
    } else if base_url.ends_with("/") {
        format!("{}chat/completions", base_url)
    } else {
        format!("{}/chat/completions", base_url)
    };

    let body = GenericChatRequest {
        model,
        messages: vec![Message {
            role: "user".to_string(),
            content: prompt,
        }],
        temperature,
    };

    let res = client
        .post(&url)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        let error_text = res.text().await.unwrap_or_else(|_| "Erro desconhecido".to_string());
        return Err(format!("AI Provider Error ({}): {}", url, error_text));
    }

    let data: GenericChatResponse = res.json().await.map_err(|e| e.to_string())?;
    
    let content = data.choices.get(0)
        .map(|c| c.message.content.clone())
        .ok_or("Resposta da IA vazia")?;

    let tokens = data.usage.map(|u| u.total_tokens).unwrap_or(0);

    Ok(LLMResponse {
        content,
        tokens_used: tokens,
    })
}
