function addField() {
    let property = document.getElementById("FamilyDoctor");
    if (property.value === "outro") {
        let hiddenForm = document.getElementById("familydoctor-hidden-until")
        hiddenForm.style.display = "block";

        let optionalsUntil = document.getElementsByClassName("optional-until")

        for (let field of optionalsUntil) {
            field.required = true;
        }
    }
}

function showProcedure() {
    let property = document.getElementById("Conclusion")

    let hiddenForm = document.getElementById("conclusion-hidden-until");
    hiddenForm.style.display = "block";


    let procedure = document.getElementById("procedure-field");

    procedure.className = "";
    procedure.classList.add("alert", "text-center", "mt-4");

    if (property.value === "SemSuspeita") {
        procedure.classList.add("alert-success");
        procedure.innerHTML = "Recomendação para contactar MdF para seguimento diário."
    } else if (property.value === "Suspeita") {
        procedure.classList.add("alert-warning");
        procedure.innerHTML = "Recomendação para ir à ADC."
    } else if (property.value === "SuspeitaGrave") {
        procedure.classList.add("alert-danger");
        procedure.innerHTML = "Recomendação para SU."
    }
}

$(document).ready(function(){
    $("#btnSubmit").click(function(event) {
        var form = $("#main-form")

        event.preventDefault()
        if (form[0].checkValidity() === false) {
            event.stopPropagation()
        } else {

            var formArray = $("form").serializeArray();
            printJS({
                printable: "main-form",
                type: "html",
                onPrintDialogClose: () => {
                    $.post(`/submit`, formArray)
                    window.location.replace("/form")
                }
            })


        }


        form.addClass('was-validated');
        
    });

    $("#Identification").keyup(function(event) {
        $.post(`/validate/identification`, 
        {
            Identification: event.target.value
        }, function(data, status) {
            let input = document.getElementById("Identification");
            if (data) {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            } else {
                input.classList.remove("is-valid");
                input.classList.add("is-invalid");
            }
        })
    })
});
