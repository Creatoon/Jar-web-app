exports.getRoom = (req, res, next) => {
  res.status(200).render('chatPageDefault', {
    title: 'Default'
  });
};

exports.getAnotherRoom = (req, res, next) => {
  res.status(200).render('chatPage', {
    title: res.locals.roomCame.name
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in'
  });
};

exports.getProposalpage = (req, res, next) => {
  res.status(200).render('proposalPage', {
    title: 'Join the room'
  });
};

exports.getCreateRoomPage = (req, res, next) => {
  res.status(200).render('createRoom', {
    title: 'Create Room'
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Me'
  });
};

exports.getSignupPage = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up'
  });
};
exports.getHomePage = (req, res, next) => {
  res.status(200).render('home', {
    title: 'Home'
  });
};
