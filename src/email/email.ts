import nodemailer, { Transporter } from 'nodemailer'

export class EmailService {

    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
    }

    public async sendConfirmationEmail(firstName: string, email: string, confirmationLink: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Confirm your account',
                html: `
                <html>
                  <head>
                    <style>
                      /* Style for the link */
                      .confirmation-link {
                        padding: 10px 15px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                      }
                      .confirmation-link:hover {
                        background-color: #0056b3;
                      }
                    </style>
                  </head>
                  <body>
                    <p>Hello <strong>${firstName}</strong>,</p>
                    <p>
                      Click <a class="confirmation-link" href="${confirmationLink}">here</a> 
                      to confirm your account.
                    </p>
                  </body>
                </html>
              `
            })
        } catch (e) {
            console.error(e);
        }
    }
}