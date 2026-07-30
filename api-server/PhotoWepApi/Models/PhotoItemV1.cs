using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace PhotoWepApi.Models
{
    public class PhotoItem
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        [BsonRepresentation(BsonType.ObjectId)] // Converts internal ObjectId to a string
        public string? Id { get; set; } // This will appear as "Id" or "_id" in your JSON



        public string SourceFile { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;

        public double GPSLatitude { get; set; }
        public double GPSLongitude { get; set; }
        public double GPSAltitude { get; set; }
        public double GPSAltitudeRef { get; set; }

        public double GPSImgDirection { get; set; }

        public string CompassReference { get; set; } = string.Empty;

        public string GPSDateStamp { get; set; } = string.Empty;
        public string GPSTimeStamp { get; set; } = string.Empty;
        public string DateTimeOriginal { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

    }

    public class PhotoItemV1
    {



        public string SourceFile { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;

        public double GPSLatitude { get; set; }
        public double GPSLongitude { get; set; }
        public double GPSAltitude { get; set; }
        public double GPSAltitudeRef { get; set; }

         public double GPSImgDirection { get; set; }

        public string CompassReference { get; set; } = string.Empty;

        public string GPSDateStamp { get; set; } = string.Empty;
        public string GPSTimeStamp { get; set; } = string.Empty;
        public string DateTimeOriginal { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

    }
}
