from PySide6 import QtWidgets, QtCore

class Header(QtWidgets.QFrame):
    def __init__(self, height, parent=None):
        super().__init__(parent)
        self.setFixedHeight(height)
        
        layout = QtWidgets.QHBoxLayout(self)
        
        