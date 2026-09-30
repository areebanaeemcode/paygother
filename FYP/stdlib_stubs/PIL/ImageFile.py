from .Image import Image, _FakeImage


class ImageFile(_FakeImage):
    pass


class Parser:
    def __init__(self):
        self.image = _FakeImage()

    def feed(self, data):
        return None

    def close(self):
        return self.image
