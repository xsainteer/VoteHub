using Infrastructure.AI;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Qdrant.Client;
using Qdrant.Client.Grpc;

namespace Infrastructure.Vector;

public class VectorService
{
    private readonly QdrantClient _qdrantClient;
    private readonly ILogger<VectorService> _logger;
    private readonly QDrantSettings _qDrantSettings;
    private readonly OllamaClient _ollamaClient;
    
    public VectorService(QdrantClient qdrantClient, ILogger<VectorService> logger, IOptions<QDrantSettings> qDrantSettings, OllamaClient ollamaClient)
    {
        _qdrantClient = qdrantClient;
        _logger = logger;
        _ollamaClient = ollamaClient;
        _qDrantSettings = qDrantSettings.Value;
    }

    public async Task EnsureCollectionExistsAsync()
    {
        try
        {
            var collectionExists = await _qdrantClient.CollectionExistsAsync(_qDrantSettings.CollectionName);
            if (!collectionExists)
            {
                var vectorParams = new VectorParams 
                { 
                    Size = (ulong)_qDrantSettings.VectorSize,
                    Distance = _qDrantSettings.Distance,
                    OnDisk = false
                };
                
                await _qdrantClient.CreateCollectionAsync(
                    _qDrantSettings.CollectionName,
                    vectorParams);
                
                _logger.LogInformation("Created Qdrant collection {CollectionName}", _qDrantSettings.CollectionName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while ensuring the collection exists.");
            throw;  
        }
    }

    public async Task IndexPollById(Guid pollId, string description)
    {
        try
        {
            await EnsureCollectionExistsAsync();
            
            var embedding = await _ollamaClient.GenerateEmbeddingAsync(description);
            
            if (embedding == null || embedding.Length != _qDrantSettings.VectorSize)
            {
                throw new InvalidOperationException("Invalid embedding generated.");
            }
            
            var point = new PointStruct
            {
                Id = new PointId(pollId),
                Vectors = embedding.ToArray()
            };
            
            await _qdrantClient.UpsertAsync(
                _qDrantSettings.CollectionName,
                new[] { point });
            
            _logger.LogInformation("Indexed poll {PollId} in Qdrant", pollId);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "An error occurred while ensuring the collection exists.");
            throw;
        }
    }
    
    public async Task DeletePollByIdAsync(Guid pollId)
    {
        try
        {
            await _qdrantClient.DeleteAsync(
               _qDrantSettings.CollectionName,
               pollId);
            _logger.LogInformation("Deleted poll {PollId} from Qdrant", pollId);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "An error occurred while deleting poll {PollId} from Qdrant", pollId);
            throw;
        }
    }

    public async Task<IEnumerable<(Guid pollId, float score)>> SearchPollsAsync(string query)
    {
        try
        {
            await EnsureCollectionExistsAsync();

            var filter = new Filter();

            var queryEmbedding = await _ollamaClient.GenerateEmbeddingAsync(query);
            
            var searchResult = await _qdrantClient.SearchAsync(
                _qDrantSettings.CollectionName,
                queryEmbedding.ToArray(),
                limit: 100,
                filter: filter);

            return searchResult.Select(r => (Guid.Parse(r.Id.Uuid), r.Score));
        }
        catch (Exception e)
        {
            _logger.LogError("Error searching in Qdrant with query: {Query}, Error: {ErrorMessage}", query, e.Message);
            throw;
        }
    }
    
    public static float CosineSimilarity(IEnumerable<float> v1, IEnumerable<float> v2)
    {
        var vec1 = v1.ToArray();
        var vec2 = v2.ToArray();

        float dot = 0, mag1 = 0, mag2 = 0;

        for (int i = 0; i < vec1.Length; i++)
        {
            dot += vec1[i] * vec2[i];
            mag1 += vec1[i] * vec1[i];
            mag2 += vec2[i] * vec2[i];
        }

        return dot / ((float)Math.Sqrt(mag1) * (float)Math.Sqrt(mag2));
    }
}