var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/status", () => new ApiStatus("OK")).WithName("GetWeatherForecast");

app.Run();

record ApiStatus(string Status)
{
    public string MachineName => Environment.MachineName;
}
