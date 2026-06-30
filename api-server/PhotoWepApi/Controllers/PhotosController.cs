using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PhotoWepApi.Models;
using System.Text.Json;

namespace PhotoWepApi.Controllers;

[ApiController]     // Tells .NET this class handles API requests
[Route("api/[controller]")] // Sets the base web path to: api/photos
public class PhotosController : ControllerBase
{
    private readonly string _jsonFilePath;

    // A standard C# options tracker to make sure JSON parsing ignores capital letters mismatch
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };


    public PhotosController(IWebHostEnvironment env)
    {
        // Dynamically finds the correct folder path no matter where the app is running
        _jsonFilePath = Path.Combine(env.ContentRootPath, "Data", "metadata.json");
    }

    [Route("")]
    [Route("GetPhotos")]
    [HttpGet]
    public IActionResult GetPhotos()
    {
        return GetPhotosFromFile();
    }

    [Route("GetPhotosByType/{type}")]
    [HttpGet]
    public IActionResult GetPhotosByType(string type)
    {
        string json = System.IO.File.ReadAllText(_jsonFilePath);

        var allPhotos = JsonSerializer.Deserialize<List<PhotoItem>>(json, _jsonOptions);

        if (allPhotos == null)
        {
            return BadRequest(new { error = "Failed to parse json contents." });
        }

        var found = allPhotos.Where(p => p.Type == type).ToList();

        if (found == null)
        {
            return NotFound(new { message = $"Photos with type {type} was not found." });
        }

        json =  JsonSerializer.Serialize(found);

        return Content(json, "application/json");
    }


    [HttpGet("GetPhotosFromFile")]
    public IActionResult GetPhotosFromFile()
    {
        // 1. Safety check to make sure the file exists
        if (!System.IO.File.Exists(_jsonFilePath))
        {
            return NotFound(new { error = "The target mock json file was not found on disk." });
        }

        // 2. Read the raw text strings from the json file directly
        string rawJsonString = System.IO.File.ReadAllText(_jsonFilePath);

        // 3. Return the string with the content-type header explicitly set to JSON
        return Content(rawJsonString, "application/json");
    }


}
