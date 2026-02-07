from PySide6 import QtWidgets, QtCore

class Footer(QtWidgets.QFrame):
    def __init__(self, width, parent=None):
        super().__init__(parent)
        self.setFixedWidth(width)
        
        layout = QtWidgets.QWBoxLayout(self)
        
        