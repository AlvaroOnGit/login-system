import path from 'node:path';

export class ViewController {

    index = (req, res) => {
        res.sendFile(path.join(path.resolve(), 'views', 'index.html'));
    }
    login = (req, res) => {

        const { user } = req.session;

        if (user) {
            res.redirect('/');
        }

        res.sendFile(path.join(path.resolve(), 'views', 'auth.html'));
    }
    protected = (req, res) => {

        const { user } = req.session;

        if (!user) res.status(403).send('<h1>Not Authorized</h1>');

        res.sendFile(path.join(path.resolve(), 'views', 'protected.html'));
    }
}