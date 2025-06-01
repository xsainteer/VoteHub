using API.Mapper;
using Application;
using Infrastructure;
using Infrastructure.Database;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<VoteHubContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

builder.Services.AddIdentity<VoteHubUser, IdentityRole<Guid>>(options => 
        options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<VoteHubContext>()
    .AddApiEndpoints();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddAutoMapper(typeof(MapperProfile).Assembly);

builder.Services.AddInfrastructure();
builder.Services.AddApplication();


var app = builder.Build();


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