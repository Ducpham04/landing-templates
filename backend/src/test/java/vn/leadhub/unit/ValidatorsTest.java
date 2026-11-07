package vn.leadhub.unit;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import vn.leadhub.common.Validators;

class ValidatorsTest {
  @ParameterizedTest
  @CsvSource({
    "0912345678,0912345678",
    "0912 345 678,0912345678",
    "091.234.5678,0912345678",
    "+84912345678,0912345678",
    "84 912 345 678,0912345678",
    "0398-765-432,0398765432"
  })
  void normalizesValidVietnamesePhones(String raw, String expected) {
    assertThat(Validators.normalizePhone(raw)).isEqualTo(expected);
  }

  @ParameterizedTest
  @ValueSource(strings = {"123", "0123456789", "091234567", "09123456789", "abc0912345678", "0212345678", ""})
  void rejectsInvalidPhones(String raw) {
    assertThat(Validators.normalizePhone(raw)).isNull();
  }

  @Test
  void validatesEmail() {
    assertThat(Validators.isEmail("a@b.vn")).isTrue();
    assertThat(Validators.isEmail("a@b")).isFalse();
    assertThat(Validators.isEmail("a b@c.vn")).isFalse();
    assertThat(Validators.isEmail(null)).isFalse();
  }

  @Test
  void escapesLikeWildcards() {
    assertThat(Validators.escapeLike("50%_off\\")).isEqualTo("50\\%\\_off\\\\");
  }
}
