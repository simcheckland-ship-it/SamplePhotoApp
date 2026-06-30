namespace PhotoWepApi.Models
{
    public class PhotoItem
    {
        public string SourceFile { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;

        public double GPSLatitude { get; set; }
        public double GPSLongitude { get; set; }
        public double GPSAltitude { get; set; }

        public string Type { get; set; } = string.Empty;

    }
}
