
export async function getMailConfig(): Promise<any> {
    if (process.env.SMTP_SERVER) {
        return process.env.SMTP_SERVER;
    }
    else {
        // For local testing. This was signup using personal Github account.
        // Please replace it for 'dev' testing if needed. All mails received
        // is at Mailtrap.
        const localService= {
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "249d20b3906b70",
              pass: "844353993e632a"
            }
        }
        return localService;
    }
}


/**
 * Dev/Test env test account:
 * 
 *  Mailtrap account (this was signup based on personal Github account.)
    {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "249d20b3906b70",
            pass: "844353993e632a"
        }
    }
 * *********************************************
 * Prefer to use Ethereal test account but does not work for port 587 on my local laptop.
    NB! these credentials are shown only once. If you do not write these down then you have to create a new account.

    Name	Devyn Russel
    Username	devyn.russel75@ethereal.email
    Password	f6Kuw3jmNdNPRTFa8J

    Nodemailer configuration
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'devyn.russel75@ethereal.email',
            pass: 'f6Kuw3jmNdNPRTFa8J'
        }
    });
 */