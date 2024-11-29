using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace InternshipBacked.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtensions);
    void DeleteFile(string fileNameWithExtension);
}

public class FileService(IWebHostEnvironment environment) : IFileService
{

    public async Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtensions)
    {
        if (imageFile == null)
        {
            throw new ArgumentNullException(nameof(imageFile));
        }

        // Get the directory path
        var contentPath = environment.ContentRootPath;
        var uploadPath = Path.Combine(contentPath, "Uploads");

        // Ensure the directory exists
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }

        // Check the allowed extensions
        var ext = Path.GetExtension(imageFile.FileName);
        if (!allowedFileExtensions.Contains(ext))
        {
            throw new ArgumentException($"Only {string.Join(",", allowedFileExtensions)} are allowed.");
        }

        // Generate a unique filename
        var uniqueFileName = $"{Guid.NewGuid()}{ext}";

        // Construct the full file path
        var fileNameWithPath = Path.Combine(uploadPath, uniqueFileName);

        // Save the file to the directory
        using var stream = new FileStream(fileNameWithPath, FileMode.Create);
        await imageFile.CopyToAsync(stream);

        // Construct and return the public URL for accessing the file
        var fileUrl = $"https://localhost:7060/Uploads/{uniqueFileName}";
        return fileUrl;
    }


    public void DeleteFile(string fileNameWithExtension)
    {
        if (string.IsNullOrEmpty(fileNameWithExtension))
        {
            throw new ArgumentNullException(nameof(fileNameWithExtension));
        }
        var contentPath = environment.ContentRootPath;
        var path = Path.Combine(contentPath, $"Uploads", fileNameWithExtension);

        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"Invalid file path");
        }
        File.Delete(path);
    }

}