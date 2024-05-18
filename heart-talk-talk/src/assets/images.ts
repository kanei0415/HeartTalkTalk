const FILE_EXT = {
  image: 'png',
} as const;

const FILE_TREE = {
  landing: '/assets/landing',
  signup: '/assets/signup',
  main: '/assets/main',
  common: {
    cinput: '/assets/common/cinput',
    ccheck: '/assets/common/ccheck',
  },
} as const;

const images = {
  main: {
    chattingArrow: `${FILE_TREE.main}/ic-chatting-arrow.${FILE_EXT.image}`,
    systemSender: `${FILE_TREE.main}/ic-main-system-sender.${FILE_EXT.image}`,
    send: `${FILE_TREE.main}/ic-main-send.${FILE_EXT.image}`,
    report: `${FILE_TREE.main}/ic-report.${FILE_EXT.image}`,
  },
  landing: {
    logo: `${FILE_TREE.landing}/ic-landing-logo.${FILE_EXT.image}`,
    typo: `${FILE_TREE.landing}/ic-landing-typo.${FILE_EXT.image}`,
    rightArrow: `${FILE_TREE.landing}/ic-right-arrow.${FILE_EXT.image}`,
    google: `${FILE_TREE.landing}/ic-google-logo.${FILE_EXT.image}`,
  },
  common: {
    cinput: {
      email: `${FILE_TREE.common.cinput}/ic-input-email.${FILE_EXT.image}`,
      password: `${FILE_TREE.common.cinput}/ic-input-password.${FILE_EXT.image}`,
    },
    ccheck: {
      empty: `${FILE_TREE.common.ccheck}/ic-select-empty.${FILE_EXT.image}`,
      fill: `${FILE_TREE.common.ccheck}/ic-select-fill.${FILE_EXT.image}`,
    },
  },
  signup: {
    camera: `${FILE_TREE.signup}/ic-signup-camera.${FILE_EXT.image}`,
  },
} as const;

export default images;
