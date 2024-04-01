enum JWT {
    LONG_LIVED = "24h",
    SHORT_LIVED = "30s"
}

import { JwtPayload } from "jsonwebtoken";

export interface SecureMeJWT extends JwtPayload {
    data: {
        username?: String
    }
}

export default JWT;