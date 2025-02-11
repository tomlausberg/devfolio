from PIL import Image, ImageDraw


def make_round_image(input_path, output_path):
    # Open the input image
    img = Image.open(input_path).convert("RGBA")

    # Create a mask to make the image round
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + img.size, fill=255)

    # Apply the mask to the image
    img.putalpha(mask)

    # Create a new image with a transparent background
    output_img = Image.new("RGBA", img.size, (255, 255, 255, 0))
    output_img.paste(img, (0, 0), img)

    # Save the output image
    output_img.save(output_path, format="PNG")


# Example usage
make_round_image("images/BadgeFoto_TomLausberg.jpg", "profile_round.png")
