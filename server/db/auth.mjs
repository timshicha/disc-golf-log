import db, { SCHEMA } from "./db_setup.mjs";

const addEmailLoginCode = async (email, expires_at, code) => {
    const result = await db`INSERT INTO ${SCHEMA}.email_login_codes (email, expires_at, code)
        VALUES (${email}, ${expires_at}, ${code}) ON CONFLICT (email) DO UPDATE
        SET expires_at = EXCLUDED.expires_at, code = EXCLUDED.code`;
    return result.count > 0;
}

const confirmEmailLoginCode = async (email, code) => {
    if(!code) {
        return { success: false, error: "No code was provided"};
    }
    // 0-pad the code
    code = code?.toString()?.padStart(6, "0");
    const result = (await db`SELECT * FROM ${SCHEMA}.email_login_codes WHERE email = ${email}`)?.[0];
    if(Date.now() > new Date(result.expires_at).getTime()) {
        return { success: false, error: "The code has expired"};
    }
    if(result.code !== code) {
        return { success: false, error: "The code is incorrect"};
    }
    // Delete code from database
    // .....
    return { success: true };
}

export { addEmailLoginCode, confirmEmailLoginCode };