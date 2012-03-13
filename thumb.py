import os
import Image


def resize_image(path, box, out=None, fit=True, quality=75):
    """ Downsample an image.

        @param path:    string - path to the original image
        @param box:     tuple(x, y) - the bounding box of the result image
        @param out:     file-like-object - save the image into the output stream
        @param fit:     boolean - crop the image to fill the box
        @param quality: int - JPEG quality
    """
    img = Image.open(path)
    # Preresize image with factor 2, 4, 8 and fast algorithm
    factor = 1
    while img.size[0] / factor > 2 * box[0] and img.size[1] * 2 / factor > 2 * box[1]:
        factor *= 2
    if factor > 1:
        img.thumbnail((img.size[0] / factor, img.size[1] / factor), Image.NEAREST)
    # Calculate the cropping box and get the cropped part
    if fit:
        x1 = y1 = 0
        x2, y2 = img.size
        wRatio = 1.0 * x2 / box[0]
        hRatio = 1.0 * y2 / box[1]
        if hRatio > wRatio:
            y1 = y2 / 2 - box[1] * wRatio / 2
            y2 = y2 / 2 + box[1] * wRatio / 2
        else:
            x1 = x2 / 2 - box[0] * hRatio / 2
            x2 = x2 / 2 + box[0] * hRatio / 2
        img = img.crop((int(x1), int(y1), int(x2), int(y2)))
    # Resize the image with best quality algorithm ANTI-ALIAS
    img.thumbnail(box, Image.ANTIALIAS)
    if not out:
        basefilepath, ext = os.path.splitext(path)
        out = basefilepath + ".tn.jpg"
    img.save(out, "JPEG", quality=quality)


if __name__ == '__main__':
    pass
