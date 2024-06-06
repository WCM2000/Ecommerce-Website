import fetch from "isomorphic-fetch";
import axios from "axios";
import queryString from "query-string";

let API = process.env.NEXT_PUBLIC_API_DEVELOPMENT;

if (process.env.NEXT_PUBLIC_PRODUCTION == true) {
  API = process.env.NEXT_PUBLIC_API_PRODUCTION;
}

export const createReview = async (data, token) => {
  console.log(token);
  let url = `${API}/reviews/`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const allReviews = (paramsData) => {
  let url = `${API}/reviews`;

  return axios(url, {
    method: "GET",
    // params: { ...query },
    params: {
      //   page: paramsData.page,
      //   limit: paramsData.limit,
      product: paramsData.productId,
      //   userId: paramsData.userId,
      //   "subTotal[lte]": paramsData.price,
      //   createdAt: paramsData.createdAt,
      //   status: paramsData.status,
      //   _id: paramsData.reviewId,
      //   name: paramsData.name,
      //   city: paramsData.city,
      //   brandname: paramsData.brandname,
      //   review: paramsData.review,
      //   "price[gte]": paramsData.priceMin,
      //   "price[lte]": paramsData.priceMax,
      //   sort: paramsData.sort,
    },
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
export const oneReview = (id) => {
  let url = `${API}/reviews/${id}`;

  return axios(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const updateReview = async (id, data, token) => {
  console.log(id, data, token);
  let url = `${API}/reviews/${id}`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const deleteReview = async (id, token) => {
  let url = `${API}/reviews/${id}`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

// export const searchreviews = (params) => {
//   // console.log(params);
//   let query = queryString.stringify(params);
//   // console.log(query);
//   let url = `${API}/reviews/search?${query}`;
//   // console.log(url);

//   return fetch(url, {
//     method: "GET",
//   })
//     .then((response) => {
//       // console.log(response);
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//       return err;
//     });
// };
