using MetadataExtractor;
using MetadataExtractor.Formats.Exif;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PhotoWepApi.Helpers;
using PhotoWepApi.Models;
using System.Globalization;
using System.Text.Json;


namespace PhotoWepApi.Controllers;

[ApiController]     // Tells .NET this class handles API requests
[Route("api/[controller]")] // Sets the base web path to: api/photos
public class PhotosController : ControllerBase
{
    private readonly string _jsonFilePath;

    private readonly IWebHostEnvironment _environment;

    // A standard C# options tracker to make sure JSON parsing ignores capital letters mismatch
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };


    public PhotosController(IWebHostEnvironment env)
    {
        // Dynamically finds the correct folder path no matter where the app is running
        _jsonFilePath = Path.Combine(env.ContentRootPath, "Data", "metadata2.json");
        _environment = env;
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

    [Route("FolderTest/{testID}")]
    [HttpGet]
    public  IActionResult FolderTest(int testID)
    {
        string uploadFolder = Path.Combine(_environment.ContentRootPath, "uploads");
        if (testID == 1)
        {
             uploadFolder = "/var/www/photo-app/uploads";
        }
        string  v = $"FolderExists {uploadFolder} {System.IO.Directory.Exists(uploadFolder)}";
        return Ok(v);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No image file uploaded.");

        string uniqueFileName = string.Empty;
        string fullPath = string.Empty;

        try
        {
            // 1. Define the save path for a Linux server
            // Use Path.Combine to handle path separators across different operating systems safely
            //string uploadFolder = Path.Combine(_environment.ContentRootPath, "uploads");
            string uploadFolder = "/var/www/photo-app/uploads";

            // 2. Ensure the directory exists (Linux creates it with standard permissions)
            if (!System.IO.Directory.Exists(uploadFolder))
            {
                System.IO.Directory.CreateDirectory(uploadFolder);
            }

            // 3. Generate a secure, unique filename to avoid naming collisions
            uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
            fullPath = Path.Combine(uploadFolder, uniqueFileName);

            // 4. Save the stream to the Linux folder
            using (var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
            {
                await image.CopyToAsync(fileStream);
            }

            // 5. OPTIONAL: Process EXIF metadata after saving
            // Reopen a read-only stream to parse the saved file
            //var photoDetails = new PhotoMetadataResult { SavedPath = fullPath };
            //using (var readStream = System.IO.File.OpenRead(fullPath))
            //{
            //    var directories = ImageMetadataReader.ReadMetadata(readStream);
            //    var subIfdDirectory = directories.OfType<ExifSubIfdDirectory>().FirstOrDefault();
            //    if (subIfdDirectory != null)
            //    {
            //        photoDetails.CameraModel = subIfdDirectory.GetDescription(ExifDirectoryBase.TagModel);
            //    }
            //}

            //return Ok(photoDetails);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }

        try
        {
            // 1. Open the file stream directly from the HTTP request
            using var stream = image.OpenReadStream();

            // 2. Read all metadata directories from the stream
            var directories = ImageMetadataReader.ReadMetadata(stream);

            // Initialize a response object
            var photoDetails = new PhotoItem();

            photoDetails.FileName = uniqueFileName;
            photoDetails.SourceFile = fullPath;
            photoDetails.Type = "upload";

            // 3. Extract SubIFD directory (Contains Date, Exposure, Camera info)
            var subIfdDirectory = directories.OfType<ExifSubIfdDirectory>().FirstOrDefault();
            if (subIfdDirectory != null)
            {
                string? dateString = subIfdDirectory.GetDescription(ExifDirectoryBase.TagDateTimeOriginal);

                if (!string.IsNullOrEmpty(dateString))
                {
                    // 1. Parse strictly with its zone offset intact
                    string format = "yyyy:MM:dd HH:mm:ss";

                    // AssumeUniversal treats it as UTC; AdjustToUniversal ensures the Kind property is Utc
                    DateTime utcDate = DateTime.ParseExact(dateString, format, CultureInfo.InvariantCulture,
                                                           DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal);
                    photoDetails.DateTimeOriginal = utcDate.ToString("yyyy-MM-ddTHH:mm:ssZ");

                }


                //if (DateTime.TryParseExact(d, format, CultureInfo.InvariantCulture,
                //           DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                //           out DateTime utcDate))
                //{

                //}
                //photoDetails.DateTimeOriginal = subIfdDirectory.GetDescription(ExifDirectoryBase.TagDateTimeOriginal);
                //photoDetails.CameraModel = subIfdDirectory.GetDescription(ExifDirectoryBase.TagModel);
            }


            // 4. Extract GPS directory (Contains coordinates)
            var gpsDirectory = directories.OfType<GpsDirectory>().FirstOrDefault();
            if (gpsDirectory != null)
            {
                // 1. Manually pull the raw coordinates and references from EXIF tags
                var latitudeRational = gpsDirectory.GetRationalArray(GpsDirectory.TagLatitude);
                var latitudeRef = gpsDirectory.GetString(GpsDirectory.TagLatitudeRef); // "N" or "S"

                var longitudeRational = gpsDirectory.GetRationalArray(GpsDirectory.TagLongitude);
                var longitudeRef = gpsDirectory.GetString(GpsDirectory.TagLongitudeRef); // "E" or "W"

                if (latitudeRational != null && latitudeRef != null)
                {
                    // Convert Degrees, Minutes, Seconds to decimal format
                    double lat = Converters.ConvertToDecimalDegrees(latitudeRational);
                    if (latitudeRef.Equals("S", StringComparison.OrdinalIgnoreCase)) lat = -lat;
                    photoDetails.GPSLatitude = lat;
                }

                if (longitudeRational != null && longitudeRef != null)
                {
                    // Convert Degrees, Minutes, Seconds to decimal format
                    double lng = Converters.ConvertToDecimalDegrees(longitudeRational);
                    if (longitudeRef.Equals("W", StringComparison.OrdinalIgnoreCase)) lng = -lng;
                    photoDetails.GPSLongitude = lng;
                }

                if (gpsDirectory.TryGetDouble(GpsDirectory.TagImgDirection, out double degrees))
                {
                    photoDetails.GPSImgDirection = degrees; // e.g. 180.5
                }

                // Extract North Reference ("T" for True North, "M" for Magnetic)
                var d = gpsDirectory.GetDescription(GpsDirectory.TagImgDirectionRef);
                if (d != null)
                {
                    photoDetails.CompassReference = d;
                }

            }

            // Add to data
            if (!System.IO.File.Exists(_jsonFilePath))
            {
                return NotFound(new { error = "The target mock json file was not found on disk." });
            }

            string json = System.IO.File.ReadAllText(_jsonFilePath);

            var allPhotos = JsonSerializer.Deserialize<List<PhotoItem>>(json, _jsonOptions);

            if (allPhotos == null)
            {
                return BadRequest(new { error = "Failed to parse json contents." });
            }

            allPhotos.Add(photoDetails); 

            json = JsonSerializer.Serialize(allPhotos);

            System.IO.File.WriteAllText(_jsonFilePath, json);




            return Ok(photoDetails);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

}
