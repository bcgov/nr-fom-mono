// hard code some config value for now, will call the backend api to get these later

const config = {
  aws_cognito_region: "ca-central-1",
  aws_user_pools_id: "ca-central-1_yds9Vci8g",
  aws_user_pools_web_client_id: "6c9ieu27ik29mq75jeb7rrbdls", // This is App Client Id
  aws_mandatory_sign_in: "enable",
  oauth: {
    domain: `dev-fam-user-pool-domain.auth.ca-central-1.amazoncognito.com`,
    scope: ["openid"],
    redirectSignIn: `http://localhost:4200/admin`, // For some reason, vue nested path (/cognito/callback) does not work yet.
    redirectSignOut: `http://localhost:4200/admin/not-authorized`,
    responseType: "code",
  },
  federationTarget: "DEV_IDIR",
};

export default config;
