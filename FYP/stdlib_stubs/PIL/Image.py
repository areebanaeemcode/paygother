class _FakeImage:
    def __init__(self, file=None, mode='RGB', size=(1, 1)):
        self.fp = file
        self.mode = mode
        self.size = size
        self.format = 'PNG'
        self._closed = False

    def verify(self):
        return None

    def load(self):
        return None

    def close(self):
        self._closed = True

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class Image:
    MODES = ['1', 'L', 'P', 'RGB', 'RGBA', 'CMYK', 'YCbCr', 'I', 'F']

    MIME = {
        'PNG': 'image/png',
        'JPEG': 'image/jpeg',
        'JPG': 'image/jpeg',
        'GIF': 'image/gif',
        'BMP': 'image/bmp',
        'TIFF': 'image/tiff',
        'WEBP': 'image/webp',
    }

    EXTENSION = {
        '.png': 'PNG',
        '.jpg': 'JPEG',
        '.jpeg': 'JPEG',
        '.gif': 'GIF',
        '.bmp': 'BMP',
        '.tif': 'TIFF',
        '.tiff': 'TIFF',
        '.webp': 'WEBP',
    }

    @staticmethod
    def init():
        return None

    @staticmethod
    def registered_extensions():
        return {
            '.png': 'PNG',
            '.jpg': 'JPEG',
            '.jpeg': 'JPEG',
            '.gif': 'GIF',
            '.bmp': 'BMP',
            '.tif': 'TIFF',
            '.tiff': 'TIFF',
            '.webp': 'WEBP',
        }

    @staticmethod
    def open(fp, mode='r', formats=None):
        return _FakeImage(file=fp if not hasattr(fp, 'read') else None)

    @staticmethod
    def new(mode, size, color=0):
        return _FakeImage(mode=mode, size=size)

    @staticmethod
    def frombytes(mode, size, data, decoder_name='raw', *args):
        return _FakeImage(mode=mode, size=size)
