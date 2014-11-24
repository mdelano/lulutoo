// Create a function to log the response from the Mandrill API
function log(obj) {
    $('#response').text(JSON.stringify(obj));
}

// create a new instance of the Mandrill class with your API key
var m = new mandrill.Mandrill('EFP0TtWypDVL5ieuKLyQ2w');
// create a variable for the API call parameters
var params = {
    "key": "EFP0TtWypDVL5ieuKLyQ2w",
    "message": {
        "text": "",
        "subject": "Lulu Posh Website Inquiry",
        "from_email": "",
        "from_name": "",
        "to": [
          {
              "email": "reservations@luluposhhair.com",
              "name": "Margaret",
              "type": "to"
          }
        ],
        "headers": {
            "Reply-To": "reservations@luluposhhair.com"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "tags": [
            "website-inquiry"
        ],
        "metadata": {
            "website": "luluposhhair.com.com"
        },
        "images": [
            {
                "type": "image/png",
                "name": "IMAGECID",
                "content": "ZXhhbXBsZSBmaWxl"
            }
        ]
    }
}

function sendTheMail(from_email, from_name, text) {
    console.log("From Email", from_email, "From Name", from_name, "Text", text);
    params.message.from_email = from_email;
    params.message.from_name = from_name;
    params.message.text = text + " " + from_email;
    m.messages.send(params, function(){
        $("#inquiry_form").append('<pre id=\"inquiry-response">Thanks for your email! We\'ll get right back to you ;)</pre>');
    }, function(){
        $("#inquiry_form").append('<pre id=\"inquiry-response">Looks like there was a problem sending an email to the stackrise team.</pre>');
    });
}
