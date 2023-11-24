import nodemailer, { Transporter } from 'nodemailer'
import { google } from 'googleapis'
import XOAuth2 from 'nodemailer/lib/xoauth2';

// export class EmailService {

//     private transporter: Transporter;
    
//     constructor() {
//         this.transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 xoauth2gen: xoauth2.createXOAuth2Generator(),
//                 user: process.env.EMAIL,
//                 pass: process.env.PASS
//             }
//         });
//     }

//     public async sendConfirmationEmail(firstName: string, email: string, confirmationLink: string): Promise<void> {
//         try {
//             await this.transporter.sendMail({
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject: 'Confirm your account',
//                 html: `
//                 <html>
//                   <head>
//                     <style>
//                       /* Style for the link */
//                       .confirmation-link {
//                         padding: 10px 15px;
//                         background-color: #007bff;
//                         color: #fff;
//                         text-decoration: none;
//                         border-radius: 5px;
//                       }
//                       .confirmation-link:hover {
//                         background-color: #0056b3;
//                       }
//                     </style>
//                   </head>
//                   <body>
//                     <p>Hello <strong>${firstName}</strong>,</p>
//                     <p>
//                       Click <a class="confirmation-link" href="${confirmationLink}">here</a> 
//                       to confirm your account.
//                     </p>
//                   </body>
//                 </html>
//               `
//             })
//         } catch (e) {
//             console.error(e);
//         }
//     }
// }

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAUTH2",
        user: process.env.GMAIL_USERNAME,  //set these in your .env file
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN,
        expires: 3599
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
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }
}