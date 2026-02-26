const ComplianceDisclaimer = ({ className = '' }: { className?: string }) => {
  return (
    <p className={`text-xs text-neutral-400 leading-relaxed max-w-3xl ${className}`}>
      Innovation Business Development Solutions provides business formation, infrastructure, and operational support services. 
      We do not provide legal advice, tax advice, or accounting services. Entity selection and compliance requirements vary by state 
      and industry. Consult with qualified legal and tax professionals for advice specific to your situation.
    </p>
  )
}

export default ComplianceDisclaimer
