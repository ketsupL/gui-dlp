from PySide6 import QtWidgets, QtCore
from components import Header, Body


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle('gui-dlp')
        self.resize(800, 600)
        
        screen = QtWidgets.QApplication.primaryScreen()
        self.zoom = screen.logicalDotsPerInch() / 96.0

        self.HEADER_H = self.dp(60)
        self.SIDEBAR_W = self.dp(260)
        self.FOOTER_H = self.dp(40)
        
        #CONTAINERS
        self.central_widget = QtWidgets.QWidget()
        self.setCentralWidget(self.central_widget)
        
        self.main_v_layout = QtWidgets.QVBoxLayout(self.central_widget)
        self.main_v_layout.setContentsMargins(0,0,0,0)
        self.main_v_layout.setSpacing(0)
        
        header = Header(self.HEADER_H)
        self.main_v_layout.addWidget(header)

        self.main_v_layout.addWidget(Body(self.SIDEBAR_W))