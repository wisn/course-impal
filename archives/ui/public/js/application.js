/*! Libran Application
 * @author      Libran Development Team
 * @copyright   Libran Development Team, 2018
 */

const eq = (p, q) => p === q;

const or = (...conds) =>
  conds.length < 1
    ? false
    : !!conds[0]
      ? true
      : or(...conds.slice(1));

const state = {};
const props = {};

const getPage = name => {
  const elm = document.getElementsByClassName(name +'-page');

  return !!elm ? elm[0] : null;
};

const pages = {
  home: getPage('home'),
  login: getPage('login'),
  register: getPage('register'),
  admin: getPage('admin'),
  staff: getPage('staff'),
};

const getJSON = url => {
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.send(null);

  const ret = req.responseText;
  let json = null;

  try {
    json = JSON.parse(ret);
  } catch (e) {
    console.error(e);
  }

  return json;
};

const addToCart = (elm, book) => {
  elm.disabled = true;

  state.carts.push(book);
};

const loginActions = () => {
  if (!!pages.login) {
    const show = (elm, msg, form) => {
      elm.style.display = 'block';
      elm.innerText = msg;

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = false);
      form.querySelector('input[type=submit]').value = 'Masuk';
    };

    const form = pages.login.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = true);
      form.querySelector('input[type=submit]').value = 'Mencoba Masuk...';

      const msg = pages.login.querySelector('.alert');
      msg.innerText = '';

      const identifier = form.querySelector('input[name=identifier]').value;
      const password = form.querySelector('input[name=password]').value;

      if (or(identifier.length < 1, password.length < 1)) {
        show(msg, 'There is an empty field.', form);
      }
      else {
        const users = getJSON('/json/users.json');
        if (!!users) {
          const user = users
            .filter(user => user.identifier === identifier);

          if (user.length > 0 && user[0].password === password) {
            show(msg, 'Redirecting to dashboard...', form);

            window.location = '/' + user[0].privillege + '/';

            Array.from(inputs).map(elm => elm.disabled = true);
          }
          else {
            show(msg, 'Username and password doesn\'t match.', form);
          }
        }
        else {
          show(msg, 'There is a problem with the server.', form);
        }
      }

      return false;
    });
  }
};

const registerActions = () => {
  if (!!pages.register) {
    const show = (elm, msg, form) => {
      elm.style.display = 'block';
      elm.innerText = msg;

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = false);
      form.querySelector('input[type=submit]').value = 'Masuk';
    };

    const form = pages.register.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input');
      Array.from(inputs).map(elm => elm.disabled = true);
      form.querySelector('input[type=submit]').value = 'Mencoba Registrasi...';

      const msg = pages.register.querySelector('.alert');
      msg.innerText = '';

      const users = getJSON('/json/users.json');
      if (!!users) {
        const email = form.querySelector('input[name=email]').value;
        const username = form.querySelector('input[name=username]').value;
        const fullname = form.querySelector('input[name=fullname]').value;
        const password = form.querySelector('input[name=password]').value;

        const conds = [
          email.length < 1,
          username.length < 1,
          fullname.length < 1,
          password.length < 1,
        ];

        if (or(...conds)) {
          show(msg, 'Ada masukan form yang masih kosong.', form);
        } else {
          const user = users
            .filter(user =>
              user.username === username || user.email === email
            );

            if (user.filter(x => x.username === username).length > 0) {
              show(msg, 'Nama Pengguna tidak tersedia.', form);
            } else if (user.filter(x => x.email === email).length > 0) {
              show(msg, 'Alamat Email sudah digunakan.', form);
            } else {
              if (fullname.length < 3) {
                show(msg, 'Panjang Nama Lengkap minimal tiga huruf.', form);
              } else if (password.length < 5) {
                show(msg, 'Panjang Kata Kunci minimal lima karakter.', form);
              } else {
                show(
                  msg,
                  'Akun didaftarkan. Mengalihkan ke halaman akun...',
                  form,
                );

                Array.from(inputs).map(elm => elm.disabled = true);
              }
            }
        }
      } else {
        show(msg, 'Terjadi kesalahan saat mengambil data dari server.', form);
      }

      return false;
    });
  }
};

const removeStaff = elm => {
  const remove = confirm('Are you sure?');

  if (remove) {
    const parent = elm.parentNode.parentNode;
    parent.remove();
  }
};

const editStaff = elm => {
  const parent = elm.parentNode.parentNode;
  const username = parent.querySelector('.username');
  const password = parent.querySelector('.password');

  elm.attributes.class.value = 'fa fa-check';
  elm.attributes.onclick.value = 'saveStaff(this)';
  
  username.style.display = 'none';
  password.style.display = 'inline-block';
};

const saveStaff = elm => {
  const parent = elm.parentNode.parentNode;
  const username = parent.querySelector('.username');
  const password = parent.querySelector('.password');

  elm.attributes.class.value = 'fa fa-pencil';
  elm.attributes.onclick.value = 'editStaff(this)';

  password.style.display = 'none';
  username.style.display = 'inline-block';
};

const addStaff = elm => {
  const parent = elm.parentNode.parentNode;
  const identifier = parent.querySelector('.username');

  const list = document.querySelector('#staff-list');

  const row = document.createElement('div');
  row.setAttribute('class', 'row no-margin no-padding');
  const left = document.createElement('div');
  left.setAttribute('class', 'col-md-10');
  const right = document.createElement('div');
  right.setAttribute('class', 'col-md-2');
  right.setAttribute('align', 'right');

  const username = document.createElement('div');
  username.setAttribute('class', 'username');
  username.setAttribute('onclick', 'editable(this)');
  username.appendChild(document.createTextNode(identifier.value));

  const password = document.createElement('input');
  password.setAttribute('type', 'password');
  password.setAttribute('class', 'password');
  password.setAttribute('value', 'password');

  const edit = document.createElement('i');
  edit.setAttribute('class', 'fa fa-pencil');
  edit.setAttribute('onclick', 'editStaff(this)');
  const remove = document.createElement('i');
  remove.setAttribute('class', 'fa fa-close');
  remove.setAttribute('onclick', 'removeStaff(this)');

  left.appendChild(username);
  left.appendChild(password);
  right.appendChild(edit);
  right.appendChild(remove);

  row.appendChild(left);
  row.appendChild(right);

  list.appendChild(row);

  identifier.value = '';
};

const bookList = elm => {
  const books = getJSON('/json/books.json');

  books.forEach(book => {
    const row = document.createElement('div');
    row.setAttribute('class', 'row no-margin no-padding');
    const isbn = document.createElement('div');
    isbn.setAttribute('class', 'col-sm-3');
    isbn.setAttribute('align', 'center');
    isbn.appendChild(document.createTextNode(book.isbn));
    const title = document.createElement('div');
    title.setAttribute('class', 'col-sm-7');
    title.appendChild(document.createTextNode(book.title));
    const stock = document.createElement('div');
    stock.setAttribute('class', 'col-sm-2');
    stock.setAttribute('align', 'center')
    stock.appendChild(document.createTextNode(book.stock));

    row.appendChild(isbn);
    row.appendChild(title);
    row.appendChild(stock);

    elm.appendChild(row);

    state.books[book.isbn] = {
      title: book.title,
      stock: book.stock,
    };
  });
};

const retrieveBooks = () => {
  const { books } = state
  const elm = document.querySelector('#book-list');
  elm.innerHTML = '';

  Object.keys(books).forEach(code => {
    const row = document.createElement('div');
    row.setAttribute('class', 'row no-margin no-padding');
    const isbn = document.createElement('div');
    isbn.setAttribute('class', 'col-sm-3');
    isbn.setAttribute('align', 'center');
    isbn.appendChild(document.createTextNode(code));
    const title = document.createElement('div');
    title.setAttribute('class', 'col-sm-7');
    title.appendChild(document.createTextNode(books[code].title));
    const stock = document.createElement('div');
    stock.setAttribute('class', 'col-sm-2');
    stock.setAttribute('align', 'center')
    stock.appendChild(document.createTextNode(books[code].stock));

    row.appendChild(isbn);
    row.appendChild(title);
    row.appendChild(stock);

    elm.appendChild(row);
  });
};

const retrieveReports = () => {
  const { reports } = state
  const elm = document.querySelector('#report-list');

  if (reports.length < 1) {
    elm.innerHTML = 'No report.';
  }
  else {
    elm.innerHTML = '';
    reports.forEach(report => {
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(report));
      elm.appendChild(div);
    });
  }
};

const addBook = elm => {
  const parent = elm.parentNode.parentNode;
  const book = {
    isbn: parent.querySelector('.isbn'),
    title: parent.querySelector('.title'),
    stock: parent.querySelector('.stock'),
  };

  const num = parseInt(book.stock.value) || 0;

  const list = document.querySelector('#book-list');

  const row = document.createElement('div');
  row.setAttribute('class', 'row no-margin no-padding');
  const isbn = document.createElement('div');
  isbn.setAttribute('class', 'col-sm-3');
  isbn.setAttribute('align', 'center');
  isbn.appendChild(document.createTextNode(book.isbn.value));
  const title = document.createElement('div');
  title.setAttribute('class', 'col-sm-7');
  title.appendChild(document.createTextNode(book.title.value));
  const stock = document.createElement('div');
  stock.setAttribute('class', 'col-sm-2');
  stock.setAttribute('align', 'center')
  stock.appendChild(document.createTextNode(num));

  row.appendChild(isbn);
  row.appendChild(title);
  row.appendChild(stock);

  list.appendChild(row);

  state.reports.push(
    'Added ' +
    parseInt(book.stock.value) + ' ' +
    book.title.value + ' book(s).'
  );

  state.books[book.isbn.value] = {
    title: book.title.value,
    stock: num,
  };

  retrieveReports();

  book.isbn.value = '';
  book.title.value = '';
  book.stock.value = '';
};

const adminActions = () => {
  if (!!pages.admin) {
    const staff = getJSON('/json/users.json')
      .filter(user => user.privillege === 'staff');

    state.staff = staff;
    state.books = {};

    const removeStaff = identifier => {
      console.log(state.staff);
    };

    let elm = document.querySelector('#staff-list');
    staff.forEach(staff => {
      const row = document.createElement('div');
      row.setAttribute('class', 'row no-margin no-padding');
      const left = document.createElement('div');
      left.setAttribute('class', 'col-sm-10');
      const right = document.createElement('div');
      right.setAttribute('class', 'col-sm-2');
      right.setAttribute('align', 'right');

      const username = document.createElement('div');
      username.setAttribute('class', 'username');
      username.setAttribute('onclick', 'editable(this)');
      username.appendChild(document.createTextNode(staff.identifier));

      const password = document.createElement('input');
      password.setAttribute('type', 'password');
      password.setAttribute('class', 'password');
      password.setAttribute('value', 'password');

      const edit = document.createElement('i');
      edit.setAttribute('class', 'fa fa-pencil');
      edit.setAttribute('onclick', 'editStaff(this)');
      const remove = document.createElement('i');
      remove.setAttribute('class', 'fa fa-close');
      remove.setAttribute('onclick', 'removeStaff(this)');

      left.appendChild(username);
      left.appendChild(password);
      right.appendChild(edit);
      right.appendChild(remove);

      row.appendChild(left);
      row.appendChild(right);

      elm.appendChild(row);
    });

    elm = document.querySelector('#book-list');
    bookList(elm);
  }
};

const retrieveMembers = () => {
  const members = getJSON('/json/members.json');

  members.forEach(member =>
    state.members[member.usercode] = {
      fullname: member.fullname,
    }
  );
};

const lendBook = elm => {
  const parent = elm.parentNode.parentNode;
  const usercode = parent.querySelector('.code');
  const isbn = parent.querySelector('.isbn');

  state.books[isbn.value].stock -= 1;

  state.reports.push(
    state.books[isbn.value].title + ' ' +
    'lent to ' + state.members[usercode.value].fullname + '.'
  );

  retrieveReports();
  retrieveBooks();

  usercode.value = '';
  isbn.value = '';
};

const returnBook = elm => {
  const parent = elm.parentNode.parentNode;
  const usercode = parent.querySelector('.code');
  const isbn = parent.querySelector('.isbn');

  state.books[isbn.value].stock += 1;

  state.reports.push(
    state.books[isbn.value].title + ' ' +
    'returned by ' + state.members[usercode.value].fullname + '.'
  );

  retrieveReports();
  retrieveBooks();

  usercode.value = '';
  isbn.value = '';
};

const addMember = elm => {
  const parent = elm.parentNode.parentNode;
  const usercode = parent.querySelector('.code');
  const fullname = parent.querySelector('.fullname');

  state.members[usercode.value] = {
    fullname: fullname.value,
  };

  state.reports.push(
    fullname.value + ' ' +
    'has been registered.'
  );

  retrieveReports();

  usercode.value = '';
  fullname.value = '';
};

const staffAction = () => {
  if(!!pages.staff) {
    state.reports = [];
    state.books = {};
    state.members = {};

    let elm;

    elm = document.querySelector('#book-list');
    bookList(elm);

    retrieveMembers();
  }
};

const actions = {
  loginActions,
  registerActions,
  adminActions,
  staffAction,
};

Object.keys(actions).forEach(fn => actions[fn]());
