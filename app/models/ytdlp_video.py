import yt_dlp
import json

class YtDlpVideo:
    def __init__(self, info_dict):
        self.title = info_dict.get('title')
        self.thumbnail = info_dict.get('thumbnail')
        self.duration = info_dict.get('duration')
        self.channel = info_dict.get('channel')
        
        self.formats = [_VideoFormat(f) for f in info_dict.get('formats', [])]
    
    
class _VideoFormat:
    def __init__(self, raw_format):
        if raw_format.get('format_note') != 'storyboard':
            self.id = raw_format.get('format_id')
            self.filesize = raw_format.get('filesize', 0)
            self.format_note = raw_format.get('format_note', '')
            self.ext = raw_format.get('ext')
            self.acodec = raw_format.get('acodec', 'none')
            self.vcodec = raw_format.get('vcodec', 'none')
            
            if self.acodec != 'none' and self.vcodec != 'none':
                self.type = 'combined'
            elif self.acodec != 'none' and self.vcodec == 'none':
                self.type = 'audio_only'
            elif self.acodec == 'none' and self.vcodec != 'none':
                self.type = 'video_only'
            else:
                self.type = 'other'