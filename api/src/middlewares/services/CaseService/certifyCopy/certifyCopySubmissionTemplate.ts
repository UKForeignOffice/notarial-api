const template = `
<p>Dear {{post}}, </p>

<p>You have a new application for certifying a copy of a document.</p>
<p>
    Below is the information the applicant entered in their online application. Attached are the documents they submitted.
    Use them to create a new case in Orbit.
</p>
<p>
    If the applicant needs to book an appointment, you’ll get a separate email from CABS when they complete their booking.
</p>
<p>
    Do not forward this email. Enter the details into Orbit and delete it from the shared mailbox once you have processed the application.
</p>
<p>
    FCDO Documents Policy Team
    <a href="mailto:DocumentPolicyQueries@fcdo.gov.uk">DocumentPolicyQueries@fcdo.gov.uk</a>
</p>

<h2>Application information</h2>

<ul>
    <li>Reference: {{ reference }}</li>
    <li>Country: {{ country }}</li>
</ul>

<h3>Fees:</h3>
<p>Number of copies requested - {{numCertifiedCopies}}</p>
<ul>
    <li>Paid: {{payment.status}}</li>
    <li>
        Payment amount: {{payment.total}}
    </li>
    <li>
        payment ID: {{ payment.id }} <a href="{{payment.url}}">(View payment details or refund)</a>
    </li>
    <li>
        <a href="{{payment.allTransactionsByCountry.url}}"> View all transactions for {{payment.allTransactionsByCountry.country}}</a>
    </li> 
</ul>



    {{#each questions}}
        {{#if this}}
            <h4>{{@key}}</h4>
            <ul>
                {{#each this}}
                    {{#if (eq this.title "Can our partner contact you for feedback to help improve this service?")}}
                        {{#if this.answer}}
                            {{#if (eq this.answer true)}}
                                <li>{{this.title}}: {{this.answer}}</li>
                            {{else}}
                                <li>{{this.title}}: false</li>
                            {{/if}}
                        {{else}}
                            <li>{{this.title}}: false</li>
                        {{/if}}
                    {{else}}
                        {{#if this.answer}}
                            <li>{{this.title}}: {{this.answer}}</li>
                        {{/if}}
                    {{/if}}
                {{/each}}
            </ul>
        {{/if}}
    {{/each}}


`;
export default template;
