# ADR 002: Additional Services
Date: 2024-09-05
## Status
[Accepted]

Notarial-api is currently used to handle marriage cases, but will be expanded to support additional services, 
for example, certifying documents. 

## Decision
We will implement Option 1, since it gives us most flexibility if partial rollout to orbit is scheduled (e.g. first marriage, then certify a document).

## Options / Rationale

### Option 1
- Change `staffService` to be `CertifyCopyCaseService` and add `CertifyDocumentCaseService`. There should be a new abstract class, `CaseService`, which both services extend
- Update `/emails/ses` to check for the correct types, and call the appropriate service (e.g. `CertifyCopyCaseService` or `CertifyDocumentCaseService`)
- Update `SubmitService.submitForm` to check `metadata.type` and call the appropriate service

`UserService` does not need to be changed significantly, only updated to accept new template types.

### Option 2
- Update `staffService` to handle the additional services
  - Staff service may start to become overloaded with the different documents it needs to handle


## Consequences

### Option 1
- Partial rollout to orbit is possible (e.g. first marriage, then certify a document)
- Will initially require more work/refactoring shifting around code

### Option 2
- The fastest option to implement but Option 1 will eventually be required. We would then need to do more refactoring. 
