$(function () {
    $(".comment").click(function(e) {
        var target =$(this);
        var toId =target.data("tid");
        var commentId =target.data("cid");

        if($("#toId").length >0) {
            $("#toId").val(toId);
        }else {
            $("<input>").attr({
                type:"hidden",
                name:"comment[tid]",
                value: toId
            }).appendTo("#commentForm");
        }
        
        if($("#CommentId").length >0) {
            $("#CommentId").val(CommentId);
        }else {
            $("<input>").attr({
                type:"hidden",
                name:"comment[cid]",
                value: commentId
            }).appendTo("#commentForm");
        }
    })
})

