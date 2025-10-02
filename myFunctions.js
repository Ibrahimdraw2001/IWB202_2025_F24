// myFunctions.js - الدوال الأساسية للمشروع (تم التحديث لدعم حقل الصورة)

// التأكد من تحميل مكتبة JQuery بالكامل قبل تنفيذ الكود
$(document).ready(function() {
    
    // =======================================================
    // 1. وظيفة التحقق من صحة الإدخال في صفحة add_app.html
    // =======================================================
    
    // استماع لحدث إرسال النموذج (Submit)
    $('#addAppForm').on('submit', function(e) {
        // منع الإرسال التلقائي للنموذج (لتنفيذ التحقق أولاً)
        e.preventDefault(); 
        
        // إزالة رسائل الأخطاء السابقة
        $('.error-message').remove();

        let isValid = true;
        
        // جلب قيم المدخلات
        const appName = $('#appName').val().trim();
        const company = $('#companyName').val().trim();
        const url = $('#appUrl').val().trim();
        const imageUrl = $('#appImageUrl').val().trim();
        
        // التحقق من اسم التطبيق (أحرف هجائية إنكليزية فقط، بدون فراغات)
        const appNameRegex = /^[A-Za-z]+$/;
        if (!appNameRegex.test(appName)) {
            $('#appName').after('<p class="error-message">الرجاء إدخال اسم التطبيق بأحرف إنكليزية هجائية فقط (بدون فراغات أو أرقام).</p>');
            isValid = false;
        }

        // التحقق من اسم الشركة المصنعة (أحرف هجائية إنكليزية وأرقام فقط)
        const companyRegex = /^[A-Za-z0-9\s]+$/;
        if (!companyRegex.test(company)) {
            $('#companyName').after('<p class="error-message">الرجاء إدخال اسم الشركة بأحرف إنكليزية هجائية وأرقام فقط.</p>');
            isValid = false;
        }

        // التحقق من الموقع الإلكتروني (URL)
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
            $('#appUrl').after('<p class="error-message">الرجاء إدخال رابط موقع إلكتروني صحيح (يبدأ بـ http/https).</p>');
            isValid = false;
        }
        
        // التحقق من رابط الصورة (URL)
        if (!urlRegex.test(imageUrl)) {
            $('#appImageUrl').after('<p class="error-message">الرجاء إدخال رابط صورة صحيح وفعال (يجب أن يكون رابطاً).</p>');
            isValid = false;
        }
        
        // TODO: هنا يمكنك إضافة تحققات أخرى مثل التأكد من اختيار قيمة في حقول القائمة المنسدلة
        
        if (isValid) {
            // =======================================================
            // 2. وظيفة نقل البيانات إلى الصفحة السابقة (apps.html)
            // =======================================================
            
            // جلب البيانات الحالية المخزنة أو إنشاء مصفوفة جديدة
            let storedApps = JSON.parse(localStorage.getItem('newApps')) || [];

            // إنشاء كائن التطبيق الجديد
            const newApp = {
                name: appName,
                company: company,
                usage: $('#usageField').val(),
                isFree: $('#isFreeField').val() === 'true', 
                url: url,
                imageUrl: imageUrl, // تم إضافة حقل الصورة
                description: $('#appDescription').val().trim()
            };

            // إضافة التطبيق الجديد
            storedApps.push(newApp);

            // تخزين المصفوفة المحدثة
            localStorage.setItem('newApps', JSON.stringify(storedApps));
            
            // الانتقال إلى صفحة عرض التطبيقات
            window.location.href = 'apps.html';
        }
    });

    // =======================================================
    // 3. وظيفة إعادة الحقول إلى قيمها الافتراضية
    // =======================================================
    $('#resetButton').on('click', function() {
        $('#addAppForm')[0].reset();
        $('.error-message').remove(); // مسح رسائل الأخطاء عند إعادة الضبط
    });
    
    // =======================================================
    // 4. وظيفة إخفاء وإظهار التفاصيل في صفحة apps.html
    //    و5. وظيفة تحميل التطبيقات المضافة ديناميكياً
    // =======================================================
    
    // هذه الوظائف تعمل فقط في صفحة apps.html
    if (window.location.pathname.endsWith('apps.html')) {
        
        // وظيفة ربط حدث الإظهار/الإخفاء (مستخدمة للثابت والديناميكي)
        function setupToggleDetails() {
            $('.toggle-details').off('click').on('click', function(e) {
                e.preventDefault();
                const detailsRow = $(this).closest('tr').next('.details-row');
                detailsRow.toggle(400); // إضافة تأثير انتقال (Animation)
                
                if (detailsRow.is(':visible')) {
                    $(this).text('إخفاء التفاصيل');
                } else {
                    $(this).text('إظهار التفاصيل');
                }
            });
        }
        
        // تنفيذ لربط الأحداث للعناصر الثابتة في البداية
        setupToggleDetails();

        // تحميل التطبيقات المضافة ديناميكياً
        let newApps = JSON.parse(localStorage.getItem('newApps')) || [];
        
        if (newApps.length > 0) {
            const tableBody = $('#appsTableBody');
            
            newApps.forEach((app, index) => {
                const isFreeText = app.isFree ? 'مجاني' : 'غير مجاني';
                const rowId = `dynamic-row-${index}`;
                
                // إضافة الصف الأساسي
                const newRow = `
                    <tr id="${rowId}">
                        <td>${app.name}</td>
                        <td>${app.company}</td>
                        <td>${app.usage}</td>
                        <td>${isFreeText}</td>
                        <td><a href="#" class="toggle-details">إظهار التفاصيل</a></td>
                    </tr>
                `;
                tableBody.append(newRow);
                
                // إضافة صف التفاصيل المخفي مبدئياً - تم إضافة حقل الصورة هنا
                 const detailsRow = `
                    <tr class="details-row" style="display: none;">
                        <td colspan="5">
                            <div class="app-details">
                                <p><strong>اسم التطبيق:</strong> ${app.name}</p>
                                <p><strong>الشركة المطورة/مجال الاستخدام:</strong> ${app.company} / ${app.usage}</p>
                                <p><strong>مجاني/غير مجاني:</strong> ${isFreeText}</p>
                                <p><strong>عنوان الموقع الإلكتروني:</strong> <a href="${app.url}" target="_blank">${app.url}</a></p>
                                <p><strong>شرح مختصر:</strong> ${app.description}</p>
                                <p><strong>شعار التطبيق:</strong> 
                                    <img src="${app.imageUrl}" onerror="this.onerror=null; this.src='https://placehold.co/100x100/CCCCCC/000000?text=Logo';" alt="شعار ${app.name}" class="app-logo">
                                </p>
                                
                            </div>
                        </td>
                    </tr>
                `;
                tableBody.append(detailsRow);
            });
            
            // إعادة ربط وظيفة الإخفاء/الإظهار بالعناصر المضافة حديثاً
            setupToggleDetails();
        }
    }
});
