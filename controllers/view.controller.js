import path from 'node:path';

export class ViewController {

    index = (req, res) => {
        res.sendFile(path.join(path.resolve(), 'views', 'index.html'));
    }
    login = (req, res) => {
        res.sendFile(path.join(path.resolve(), 'views', 'auth.html'));
    }
}