using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using System.Text.RegularExpressions;
using System.Text;

namespace CoffeeShop.API.Services;

public class MinioService
{
    private readonly IMinioClient _minio;
    private readonly MinioSettings _settings;

    public MinioService(
        IMinioClient minio,
        IOptions<MinioSettings> settings)
    {
        _minio = minio;
        _settings = settings.Value;
    }

    public async Task<string> UploadAsync(
        IFormFile file,
        string folder,
        string fileName)
    {
        var objectName = $"{folder}/{fileName}";

        using var stream = file.OpenReadStream();

        await _minio.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType)
        );

        return
            $"http://localhost:9000/" +
            $"{_settings.BucketName}/{objectName}";
    }

    public async Task DeleteAsync(string imageUrl)
    {
        var uri = new Uri(imageUrl);

        var path = uri.AbsolutePath.Trim('/');

        var firstSlash = path.IndexOf('/');

        var bucketName = path[..firstSlash];

        var objectName =
            Uri.UnescapeDataString(
                path[(firstSlash + 1)..]
            );

        Console.WriteLine($"BUCKET: {bucketName}");
        Console.WriteLine($"OBJECT: {objectName}");

        await _minio.RemoveObjectAsync(
            new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
        );
    }

    public string GenerateSlug(string text)
    {
        var map = new Dictionary<char, string>
        {
            ['а'] = "a",
            ['б'] = "b",
            ['в'] = "v",
            ['г'] = "g",
            ['д'] = "d",
            ['е'] = "e",
            ['ё'] = "e",
            ['ж'] = "zh",
            ['з'] = "z",
            ['и'] = "i",
            ['й'] = "y",
            ['к'] = "k",
            ['л'] = "l",
            ['м'] = "m",
            ['н'] = "n",
            ['о'] = "o",
            ['п'] = "p",
            ['р'] = "r",
            ['с'] = "s",
            ['т'] = "t",
            ['у'] = "u",
            ['ф'] = "f",
            ['х'] = "h",
            ['ц'] = "c",
            ['ч'] = "ch",
            ['ш'] = "sh",
            ['щ'] = "sch",
            ['ъ'] = "",
            ['ы'] = "y",
            ['ь'] = "",
            ['э'] = "e",
            ['ю'] = "yu",
            ['я'] = "ya",
        };

        text = text.ToLower();

        var result = new StringBuilder();

        foreach (var ch in text)
        {
            if (map.ContainsKey(ch))
            {
                result.Append(map[ch]);
            }
            else if (
                (ch >= 'a' && ch <= 'z') ||
                (ch >= '0' && ch <= '9')
            )
            {
                result.Append(ch);
            }
            else if (char.IsWhiteSpace(ch) || ch == '-')
            {
                result.Append("-");
            }
        }

        var slug = result.ToString();

        slug = Regex.Replace(slug, "-+", "-");

        slug = slug.Trim('-');

        return slug;
    }
}

