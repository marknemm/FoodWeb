SELECT * FROM ReceiverOrganization
INNER JOIN OrganizationInfo ON ReceiverOrganization.organizationInfoKey = OrganizationInfo.organizationInfoKey;

SELECT * FROM DonorOrganization
INNER JOIN OrganizationInfo ON DonorOrganization.organizationInfoKey = OrganizationInfo.organizationInfoKey;