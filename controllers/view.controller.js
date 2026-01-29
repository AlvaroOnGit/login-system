
export class ViewController {

    index = (req, res) => {
        res.end('<h1>Main Page</h1>');
    }
    login = (req, res) => {
        res.end('<h1>Login</h1>');
    }
}