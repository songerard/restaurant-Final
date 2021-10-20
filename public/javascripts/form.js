// ******* Validation ******* //

// disabling form submissions if there are invalid fields
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

// ******* Edit page and New page ******* //

// show and hide input form for other category
function categoryForm(selectedCategory) {
  const otherCategory = document.querySelector('.other-category')
  if (selectedCategory === '其他') {
    otherCategory.classList.remove('invisible')
    otherCategory.classList.add('visible')
    otherCategory.pattern = ".*\\S+.*"
    otherCategory.required = true
  } else {
    otherCategory.classList.remove('visible')
    otherCategory.classList.add('invisible')
    otherCategory.removeAttribute('pattern')
    otherCategory.required = false
  }
}

// show rating and stars
function showRating(rating) {

  // show rating
  const ratingNum = document.querySelector('#star-rating')
  ratingNum.innerText = rating

  // show star color
  const stars = document.querySelectorAll('.star')
  for (let i = 0; i < stars.length; i++) {
    if (rating >= i + 1) {
      stars[i].classList.remove('far')
      stars[i].classList.remove('fa-star-half-alt')
      stars[i].classList.add('fas')
      stars[i].classList.add('fa-star')
    } else if (rating >= i + 0.5) {
      stars[i].classList.remove('far')
      stars[i].classList.remove('fa-star')
      stars[i].classList.add('fas')
      stars[i].classList.add('fa-star-half-alt')
    } else {
      stars[i].classList.remove('fas')
      stars[i].classList.remove('fa-star-half-alt')
      stars[i].classList.add('far')
      stars[i].classList.add('fa-star')
    }
  }
}

// ******** Index page Sort function ******** //

function showSortingForm() {
  // select sorting form and button
  const sortingForm = document.querySelector('.sorting-form')
  const showSortingFormBtn = document.querySelector('.show-sorting-form-btn')

  // change sorting button attribute
  showSortingFormBtn.classList.remove('btn-primary')
  showSortingFormBtn.classList.add('btn-danger')
  showSortingFormBtn.innerText = '收起排序'
  showSortingFormBtn.setAttribute('onclick', 'hideSortingForm()')

  const sortingFormHTML = `
    <div class="form-row align-items-center">
      <div class="form-group col-md-3">
        <label for="sort1">第一排序</label>
        <select id="sort1" name="sort1" class="form-control sort-field" onchange="showSortingOptions(this.name)">
          <option selected disabled value="">請選擇...</option>
          <option value="rd">評分(高至低)</option>
          <option value="ra">評分(低至高)</option>
          <option value="na">名稱(A->Z)</option>
          <option value="nd">名稱(Z->A)</option>
          <option value="ca">類別(A->Z)</option>
          <option value="cd">類別(Z->A)</option>
        </select>
      </div>
      <div class="form-group col-md-3">
        <label for="sort2">第二排序</label>
        <select id="sort2" name="sort2" class="form-control sort-field" onchange="showSortingOptions(this.name)">
        </select>
      </div>
      <div class="form-group col-md-3">
        <label for="sort3">第三排序</label>
        <select id="sort3" name="sort3" class="form-control sort-field">
        </select>
      </div>
      <button type="submit" class="btn btn-secondary col-md-2 mt-3 mx-2" style="height: 38px">排序</button>
    </div>
    `
  sortingForm.innerHTML = sortingFormHTML

  // ******* show sorting query in sorting field ******* //

  // select sorting field
  const sortingFields = document.querySelectorAll('.sort-field')

  // get sorting query
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sortingQuery = []
  for (let i = 1; i <= sortingFields.length; i++) {
    sortingQuery.push(urlSearchParams.get('sort' + i))
  }

  // assign sorting query to sorting field
  for (let q = 0; q < sortingQuery.length; q++) {
    sortingFields[q].value = sortingQuery[q]
    if (q < sortingQuery.length - 1) showSortingOptions(sortingFields[q].name)
  }
}

function hideSortingForm() {
  const sortingForm = document.querySelector('.sorting-form')
  const showSortingFormBtn = document.querySelector('.show-sorting-form-btn')

  showSortingFormBtn.classList.remove('btn-danger')
  showSortingFormBtn.classList.add('btn-primary')
  showSortingFormBtn.innerText = '餐廳排序'
  showSortingFormBtn.setAttribute('onclick', 'showSortingForm()')
  sortingForm.innerHTML = ''
}

function showSortingOptions(name) {
  // sorting options
  const formOptions = [
    ['rating_desc', 'r', 'rd', '評分(高至低)'],
    ['rating_asc', 'r', 'ra', '評分(低至高)'],
    ['name_asc', 'n', 'na', '名稱(A->Z)'],
    ['name_desc', 'n', 'nd', '名稱(Z->A)'],
    ['category_asc', 'c', 'ca', '類別(A->Z)'],
    ['category_desc', 'c', 'cd', '類別(Z->A)']
  ]

  // select sort 1, 2 & 3
  const sort1 = document.querySelector('#sort1')
  const sort2 = document.querySelector('#sort2')
  const sort3 = document.querySelector('#sort3')
  const sort1Value = sort1.value
  const sort2Value = (name === 'sort1') ? '' : sort2.value

  // check next sorting priority and options
  let sortHTML = '<option selected disabled value="">請選擇...</option>'
  if (sort2Value) {
    formOptions.forEach(option => {
      if (option[1] !== sort2Value[0] && option[1] !== sort1Value[0]) {
        sortHTML = sortHTML + `<option value="${option[2]}">${option[3]}</option>`
      }
    })
    sort3.innerHTML = sortHTML
  } else if (sort1Value) {
    formOptions.forEach(option => {
      if (option[1] !== sort1Value[0]) {
        sortHTML = sortHTML + `<option value="${option[2]}">${option[3]}</option>`
      }
    })
    sort2.innerHTML = sortHTML
    sort3.innerHTML = ''
  }
}