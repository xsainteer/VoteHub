using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace Infrastructure.AI;

public class OllamaClient
{
    private readonly OllamaSettings _ollamaSettings;
    private readonly HttpClient _httpClient;

    public OllamaClient(IOptions<OllamaSettings> ollamaSettings, HttpClient httpClient)
    {
        _httpClient = httpClient;
        _ollamaSettings = ollamaSettings.Value;
    }

    public async Task<string> MakeShortDescriptionForSeedsAsync(string description)
    {
        var payload = new
        {
            model = _ollamaSettings.Model,
            prompt = $"{description}" +
                     $"Прочитай текст выше в кавычках. " +
                     $"Напиши краткий пересказ (до 30 слов), " +
                     $"по сути, без эмоций. Не добавляй ничего лишнего, только пересказ.\n",
            stream = false
        };
        
        var json = JsonSerializer.Serialize(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/generate", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        
        using var doc = JsonDocument.Parse(responseString);
        
        var result = doc.RootElement.GetProperty("response").GetString();
        if (result == null)
        {
            throw new Exception("Response from Ollama was null");
        }
        else
        {
            return result;
        }
    }

    public async Task<string?> MakeShortDescriptionAsync(string description)
    {
        var payload = new
        {
            model = _ollamaSettings.Model,
            prompt = $"{description}" +
                     $"\nПрочитай текст ввыше, выделенный кавычками." +
                     $"\nЕсли он содержит бред, угрозы, агрессию, истерику, нелогичные" +
                     $" обвинения, бессвязные фразы или эмоциональную неадекватность —" +
                     $" верни только слово “Неадекватно”.\n\nЕсли жалоба написана " +
                     $"спокойно, логично, с конкретными проблемами и без истерики " +
                     $"— верни краткий пересказ (до 30 слов), без эмоций, по сути." +
                     $"\n\nНе добавляй объяснений. Ответ должен быть строго одним из " +
                     $"двух: либо \"Неадекватно\", либо краткий пересказ.",
            stream = false
        };
        
        var json = JsonSerializer.Serialize(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/generate", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        
        using var doc = JsonDocument.Parse(responseString);
        
        return doc.RootElement.GetProperty("response").GetString();
    }
     
    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var payload = new
        {
            model = _ollamaSettings.EmbeddingModel,
            input = text,
            stream = false
        };
        
        var json = JsonSerializer.Serialize(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.PostAsync(
            "/api/embed",
            content);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OllamaEmbeddingResponse>();
        
        if (result?.Embeddings == null || result.Embeddings.Length == 0 || result.Embeddings[0] == null || result.Embeddings[0].Length == 0)
        {
            throw new Exception("Embedding response was null or empty");
        }
        
        return result.Embeddings[0];
    }
    
    private class OllamaEmbeddingResponse
    {

        [JsonPropertyName("embeddings")]
        public float[][] Embeddings { get; set; } = [];

    }
}