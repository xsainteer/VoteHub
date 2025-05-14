using Blazorise;

namespace Presentation.Extensions;


/// <summary> This class is used for better readability to customize alert component as one pleases. </summary>
public class AlertProps
{
    public bool IsVisible { get; set; }
    public Color Color { get; set; } = Color.Danger;
    public string Message { get; set; } = string.Empty;
}