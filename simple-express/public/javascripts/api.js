// 用Ajax撈資料
$(function(){
    //  $.ajax({
	// 			method: "GET",
	// 			url: "/api/stocks",				
	// 			dataType: "json",
	// 		})
	// 			.done(function (data) {
	// 				console.log(data);
					
	// 			})
	// 			.fail(function (error) {
	// 				console.log(error);
	// 			})
	// 			.always(function () {});
    axios
			.get("/api/stocks")
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
})