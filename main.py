import sys
from PySide6 import QtWidgets, QtCore
from qt_material import apply_stylesheet

class Main(QtWidgets.QMainWindow):
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

        self.header = QtWidgets.QFrame()
        self.header.setFixedHeight(self.HEADER_H)

        self.body = QtWidgets.QFrame()
        self.body_layout = QtWidgets.QHBoxLayout(self.body)
        self.body_layout.setContentsMargins(0,0,0,0)
        self.body_layout.setSpacing(0)
        
        self.sidebar = QtWidgets.QFrame()
        self.sidebar.setFixedWidth(self.SIDEBAR_W)
        
        self.main_container = QtWidgets.QFrame()
        self.main_container_layout = QtWidgets.QVBoxLayout(self.main_container)
        self.main_container_layout.setContentsMargins(0,0,0,0)
        self.main_container_layout.setSpacing(0)
        
        self.scroll_area = QtWidgets.QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setFrameShape(QtWidgets.QFrame.NoFrame)
        
        self.footer = QtWidgets.QFrame()
        self.footer.setFixedHeight(self.FOOTER_H)
        
        self.main_container_layout.addWidget(self.scroll_area)
        self.main_container_layout.addWidget(self.footer)

        self.body_layout.addWidget(self.sidebar)
        self.body_layout.addWidget(self.main_container)

        self.main_v_layout.addWidget(self.header)
        self.main_v_layout.addWidget(self.body, stretch=1)
        

        #SIDEBAR CONTENTS
        self.sidebar_v_layout = QtWidgets.QVBoxLayout(self.sidebar)
        self.sidebar_v_layout.setContentsMargins(0,0,0,0)
        self.sidebar_v_layout.setSpacing(0)
        
        label = QtWidgets.QLabel()
        label.setText('Master Settings')
        self.sidebar_v_layout.addWidget(label)
        
    def dp(self, px):
        return int(px * self.zoom)

def main():
    app = QtWidgets.QApplication(sys.argv)
    
    apply_stylesheet(app, theme='dark_red.xml')
    window = Main()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()