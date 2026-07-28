using SkiaSharp;

namespace PhotoWepApi.Helpers
{
    public class ImageResizer
    {

        public static void SaveResizedSkiaImage(SKBitmap source, string outputPath, int maxWidth, int maxHeight)
        {
            // Calculate proportional dimensions (ResizeMode.Max emulation)
            double ratioX = (double)maxWidth / source.Width;
            double ratioY = (double)maxHeight / source.Height;
            double ratio = Math.Min(ratioX, ratioY);

            // Do not upscale smaller images
            if (ratio >= 1.0)
            {
                using var image = SKImage.FromBitmap(source);
                using var data = image.Encode(SKEncodedImageFormat.Jpeg, 85);
                using var stream = System.IO.File.OpenWrite(outputPath);
                data.SaveTo(stream);
                return;
            }

            int newWidth = (int)(source.Width * ratio);
            int newHeight = (int)(source.Height * ratio);

            var samplingOptions = new SKSamplingOptions(SKCubicResampler.Mitchell);
            // Perform high-quality scaling
            using var resizedBitmap = new SKBitmap(newWidth, newHeight);
            source.ScalePixels(resizedBitmap, samplingOptions);

            // Save to disk
            using var resizedImage = SKImage.FromBitmap(resizedBitmap);
            using var encodedData = resizedImage.Encode(SKEncodedImageFormat.Jpeg, 85); // 85% Quality
            using var outputStream = System.IO.File.OpenWrite(outputPath);
            encodedData.SaveTo(outputStream);
        }

    }
}
