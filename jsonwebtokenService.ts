import * as jwt from 'jsonwebtoken';

@Injectable()
export class LogonService {
...

  authenticateLogin(username, password) {
    //Http request to JAAS for authentication
    if (result) {
      sessionStorage.setItem(CURRUSER, this.signLoginSession(username));
    } else {
      this.clearLoginSession();
    }
  }

  logout(): boolean {
    this.clearLoginSession();
    this.router.navigate(['/login']);
    return true;
  }

  signLoginSession(username: string) {
    return jwt.sign({
      username: username,
      iat: Math.floor(Date.now() / 1000) // IAT -> Input Arrival Time
    },
      this.tokenSecret,
      { expiresIn: '1h' }
    );
  }

  verifyLoginSession() {
    let signed = false;
    let decoded;
    let username = '';
    let error = '';
    try {
      decoded = jwt.verify(sessionStorage.getItem(CURRUSER), this.tokenSecret);
      username = decoded.username;
      signed = true;
    } catch (err) {
      error = err.name;
      signed = false;
    }

    return { signed: signed, username: username, error: error };
  }

  clearLoginSession() {
    sessionStorage.removeItem(CURRUSER);
  }
}

export enum WriteFileMode {
  REPLACE = 'replace',
  APPEND = 'append'
}

export interface WriteFile {
  path: string;
  mode: WriteFileMode;
  content: string;
}

export const CURRUSER = 'currUser';

