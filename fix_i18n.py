import pathlib
p = pathlib.Path("src/lib/i18n.jsx")
t = p.read_text(encoding="utf-8")
# Add missing mr keys if not present
if "stepLotInfo" not in t.split("mr: f(")[1].split("},")[0]:
    # Find mr block and insert step keys before the closing }),
    old_mr_end = '  mr: f({ selectLanguage:"भाषा निवडा"'
    # Instead, just append step keys to mr dict by replacing the tail of mr entry
    # Find where mr dict ends (the "})," after mr)
    import re
    # Match mr block
    m = re.search(r"(  mr: f\(\{.*?)(  \}\),)", t, flags=re.S)
    if m:
        mr_content = m.group(1)
        if "stepLotInfo" not in mr_content:
            # Insert before the closing }), 
            insert = '    stepLotInfo:"लॉट माहिती", stepSampling:"नमुना निवड", stepCapture:"कॅप्चर", stepQualityGate:"गुणवत्ता तपासणी", stepDetection:"ओळख", stepSize:"आकार", stepDefects:"दोष", stepConfidence:"विश्वास", stepHumanReview:"मानवी पुनरावलोकन", stepPolicyGrading:"धोरण आणि ग्रेडिंग", stepFarmerReview:"शेतकरी पुनरावलोकन", stepReportEvidence:"अहवाल आणि पुरावा",\n    lotInformation:"लॉट माहिती", representativeSampling:"प्रातिनिधिक नमुना", multiViewCapture:"बहु-दृश्य कॅप्चर", imageQualityGate:"प्रतिमा गुणवत्ता तपासणी", onionDetection:"कांदा ओळख / विभाजन", sizeAnalysis:"आकार विश्लेषण", defectAnalysis:"दोष विश्लेषण", confidenceGate:"विश्वास द्वार", humanReviewTitle:"मानवी पुनरावलोकन", versionedPolicy:"आवृत्ती धोरण आणि ग्रेडिंग", farmerGraderReview:"शेतकरी / ग्रेडर पुनरावलोकन", qualityReportEvidence:"गुणवत्ता अहवाल · पुरावा · सिंक",\n    captureGuidance:"कॅप्चर मार्गदर्शन", evenLighting:"समान प्रकाश", includeRef:"दृश्य 1 मध्ये 25 मिमी संदर्भ समाविष्ट करा", fillFrame:"फ्रेम भरा — आच्छादन टाळा", onionsVisible:"कांदे पूर्णपणे दिसावेत", procCenter:"खरेदी केंद्र", assessor:"मूल्यांकनकर्ता (ग्रेडर)",\n  }),'
            # Replace the mr block ending
            new_mr = mr_content.rstrip().rstrip(',').rstrip() + ",\n" + insert
            t = t.replace(m.group(0), new_mr, 1)
            p.write_text(t, encoding="utf-8")
            print("patched mr with steps")
        else:
            print("already patched")
    else:
        print("mr block not found")
else:
    print("no need")
