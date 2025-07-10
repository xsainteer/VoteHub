using API.Mapper;
using Application;
using Infrastructure;
using Infrastructure.Database.Entities;
using Infrastructure.Vector;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API Documentation for My Project"
    });
});

builder.Services.AddAutoMapper(typeof(MapperProfile).Assembly);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddSignalR();

var app = builder.Build();

// Ensuring Qdrant collection exists
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var vectorService = services.GetRequiredService<VectorService>();

    await vectorService.EnsureCollectionExistsAsync();
}

app.UseRouting();

//Swagger

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
    options.RoutePrefix = string.Empty;
});

app.UseAuthentication();
app.UseAuthorization();

// for the time being
app.UseCors(options => options
    .WithOrigins("http://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);
app.MapControllers();

app.MapIdentityApi<VoteHubUser>();

app.Run();