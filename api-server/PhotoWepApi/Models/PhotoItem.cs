namespace PhotoWepApi.Models
{
    public class PhotoItem
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
