import { Music } from 'lucide-react';

import './Header.css'

function Header() {
    return (
        <header className="header">
            {/*<Music className="logo" />*/}
            <h1 className="title">FLAC to MP3 Converter</h1>
            <p className="subtitle">Convert your FLAC files to MP3 directly in your browser</p>
        </header>
    )
}

export default Header;