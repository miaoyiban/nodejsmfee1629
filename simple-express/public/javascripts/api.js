// 用Ajax撈資料
$(function(){
     $.ajax({
				method: "GET",
				url: "/api/stocks",				
				dataType: "json",
			})
				.done(function (data) {
					console.log(data);
					
				})
				.fail(function (error) {
					console.log(error);
				})
				.always(function () {});
})