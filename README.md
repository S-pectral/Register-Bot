# Discord Registration Bot (v14)

Modern ve modüler bir yapıda tasarlanmış, otomatik isimden cinsiyet tespiti yapabilen gelişmiş bir Discord kayıt botu.

## 🚀 Özellikler

- **Butonlu Kayıt Sistemi:** Yeni gelen üyeleri şık bir embed ve buton karşılar.
- **Modal Form:** Üyeler kayıt olmak için isim ve yaş bilgilerini bir form üzerinden girer.
- **Otomatik Cinsiyet Tespiti:** Girilen isimden cinsiyet (Erkek/Kız) tespiti yapılır ve ona göre rol verilir.
- **İsim Doğrulama:** Girilen isimler `isimler.txt` listesiyle karşılaştırılır. Listede yoksa yetkililere haber verilir.
- **Manuel Kayıt:** Yetkililer için `.e` ve `.k` komutları ile manuel kayıt imkanı.
- **Detaylı Loglama:** Tüm başarılı ve başarısız kayıt denemeleri log kanalına bildirilir.

## 🛠️ Kurulum

1. Projeyi indirin:
   ```bash
   git clone https://github.com/S-pectral/Register-Bot
   ```
2. Proje konumuna gidin:
   ```bash
   cd Register-Bot
   ```
3. Terminali açın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. `.env.example` dosyasının adını `.env` olarak değiştirin ve gerekli alanları doldurun.
5. Botu başlatın:
   ```bash
   node index.js
   ```

## ⚙️ Yapılandırma (.env)

| Değişken | Açıklama |
|----------|----------|
| `TOKEN` | Discord Bot Token |
| `GUILD_ID` | Sunucunuzun ID'si |
| `WELCOME_CHANNEL_ID` | Karşılama mesajının gideceği kanal |
| `LOG_CHANNEL_ID` | Kayıt loglarının gideceği kanal |
| `STAFF_ROLE_ID` | Yetkili rolünün ID'si |
| `MALE_ROLE_ID` | Erkek rolünün ID'si |
| `FEMALE_ROLE_ID` | Kız rolünün ID'si |
| `UNREGISTERED_ROLE_ID`| Kayıtsız üye rolünün ID'si |

## 🕹️ Komutlar (Yetkili)

- `.e @Kullanıcı İsim Yaş`: Belirtilen üyeyi Erkek olarak kaydeder.
- `.k @Kullanıcı İsim Yaş`: Belirtilen üyeyi Kız olarak kaydeder.

## ⚠️ Önemli Notlar

- Botun rollerini yönetebilmesi için, botun rolü Discord'da yönettiği rollerin **üstünde** olmalıdır.
- Botun `Manage Nicknames` ve `Manage Roles` yetkilerine sahip olduğundan emin olun.
